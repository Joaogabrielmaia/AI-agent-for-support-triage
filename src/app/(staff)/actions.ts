"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasPendingSuggestion, suggestionTitle } from "@/lib/agent/suggestions";
import { getAgent } from "@/lib/server/agent";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";

const Reply = z.object({ ticketId: z.string().min(1), text: z.string().trim().min(1).max(2000) });

/** RF-08: a person answers the customer in the same conversation. */
export async function replyAction(formData: FormData) {
  const user = await requireUser();
  const data = Reply.parse({ ticketId: formData.get("ticketId"), text: formData.get("text") });
  const ticket = await db.ticket.findUniqueOrThrow({ where: { id: data.ticketId } });
  await db.message.create({ data: { conversationId: ticket.conversationId, role: "HUMAN", content: data.text } });
  await db.ticket.update({
    where: { id: ticket.id },
    data: { status: ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status, assigneeId: ticket.assigneeId ?? user.id },
  });
  revalidatePath(`/tickets/${ticket.id}`);
  revalidatePath("/tickets");
}

const Status = z.object({ ticketId: z.string().min(1), status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]) });

export async function setStatusAction(formData: FormData) {
  const user = await requireUser();
  const data = Status.parse({ ticketId: formData.get("ticketId"), status: formData.get("status") });
  await db.ticket.update({
    where: { id: data.ticketId },
    data: { status: data.status, resolvedAt: data.status === "DONE" ? new Date() : null, assigneeId: user.id },
  });
  revalidatePath(`/tickets/${data.ticketId}`);
  revalidatePath("/tickets");
}

const Suggest = z.object({ questions: z.array(z.string().min(1).max(1000)).min(1).max(30) });

/** v1.1: turns a repeated gap into an article draft for the team to complete (admin only). */
export async function createSuggestionAction(formData: FormData) {
  await requireUser(["ADMIN"]);
  const { questions } = Suggest.parse({ questions: JSON.parse(String(formData.get("questions"))) });
  const pending = await db.articleSuggestion.findMany({ where: { status: "PENDING" }, select: { questions: true } });
  if (hasPendingSuggestion({ question: questions[0], questions, count: questions.length }, pending)) return;
  const draft = await getAgent().provider.draftArticle({ questions });
  await db.articleSuggestion.create({
    data: { title: suggestionTitle(questions), questions, occurrences: Number(formData.get("count")) || questions.length, draft: draft.text },
  });
  revalidatePath("/lacunas");
  revalidatePath("/sugestoes");
}

const Decide = z.object({ id: z.string().min(1), status: z.enum(["ACCEPTED", "DISCARDED"]) });

export async function decideSuggestionAction(formData: FormData) {
  await requireUser(["ADMIN"]);
  const data = Decide.parse({ id: formData.get("id"), status: formData.get("status") });
  await db.articleSuggestion.update({ where: { id: data.id }, data: { status: data.status, decidedAt: new Date() } });
  revalidatePath("/sugestoes");
  revalidatePath("/lacunas");
}

const Rate = z.object({ messageId: z.string().min(1), path: z.string().startsWith("/").max(200), rating: z.enum(["CORRECT", "INCORRECT"]) });

/** RF-09: the attendant marks whether the agent's answer was correct. */
export async function rateAction(formData: FormData) {
  const user = await requireUser();
  const data = Rate.parse({ messageId: formData.get("messageId"), path: formData.get("path"), rating: formData.get("rating") });
  await db.message.update({ where: { id: data.messageId }, data: { rating: data.rating, ratedById: user.id, ratedAt: new Date() } });
  revalidatePath(data.path);
}
