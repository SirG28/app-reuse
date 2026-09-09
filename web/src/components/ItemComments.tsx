"use client";

import { useState } from "react";
import useSWR, { type KeyedMutator } from "swr";
import { useForm } from "react-hook-form";
import { textAreaClass } from "@/lib/formStyles";

type Resposta = {
  id: string;
  conteudo: string;
  createdAt: string;
  user: { name: string };
};

type Comentario = Resposta & {
  replies: Resposta[];
};

type FormValues = { conteudo: string };

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Falha ao carregar comentários.");
    return res.json();
  });

async function enviarComentario(
  itemId: string,
  conteudo: string,
  parentId?: string
) {
  const res = await fetch(`/api/items/${itemId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conteudo, parentId }),
  });
  const body = await res.json().catch(() => null);
  return { ok: res.ok, body };
}

function ComentarioCard({
  comentario,
  itemId,
  mutate,
}: {
  comentario: Comentario;
  itemId: string;
  mutate: KeyedMutator<Comentario[]>;
}) {
  const [respondendo, setRespondendo] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit({ conteudo }: FormValues) {
    const { ok, body } = await enviarComentario(itemId, conteudo, comentario.id);

    if (!ok) {
      setError("conteudo", {
        message: body?.error ?? "Não foi possível enviar a resposta.",
      });
      return;
    }

    reset();
    setRespondendo(false);
    // Uma resposta muda a lista aninhada (dentro de "replies"); em vez de
    // remontar essa árvore no cliente, revalidamos a lista inteira.
    mutate();
  }

  return (
    <div className="rounded-xl border border-reuse-border bg-white p-3.5">
      <p className="text-sm text-reuse-text">{comentario.conteudo}</p>
      <p className="mt-1.5 text-xs text-reuse-text-secondary">
        {comentario.user.name} ·{" "}
        {dateTimeFormat.format(new Date(comentario.createdAt))}
      </p>

      {comentario.replies.length > 0 && (
        <div className="mt-3 flex flex-col gap-2.5 border-l-2 border-reuse-border pl-3">
          {comentario.replies.map((resposta) => (
            <div key={resposta.id}>
              <p className="text-sm text-reuse-text">{resposta.conteudo}</p>
              <p className="mt-1 text-xs text-reuse-text-secondary">
                {resposta.user.name} ·{" "}
                {dateTimeFormat.format(new Date(resposta.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}

      {respondendo ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <textarea
            placeholder="Escreva uma resposta..."
            className={`${textAreaClass} mb-2`}
            {...register("conteudo", {
              required: "Escreva algo antes de enviar.",
            })}
          />

          {errors.conteudo?.message && (
            <p className="mb-2 text-xs text-reuse-danger">
              {errors.conteudo.message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-reuse-green-dark px-3.5 py-1.5 text-xs font-bold text-white disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Responder"}
            </button>
            <button
              type="button"
              onClick={() => setRespondendo(false)}
              className="rounded-lg border border-[#CCCCCC] px-3.5 py-1.5 text-xs font-semibold text-[#666666]"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setRespondendo(true)}
          className="mt-2 text-xs font-semibold text-reuse-green-accent"
        >
          Responder
        </button>
      )}
    </div>
  );
}

export default function ItemComments({
  itemId,
  isOwner = false,
}: {
  itemId: string;
  isOwner?: boolean;
}) {
  const {
    data: comentarios,
    isLoading,
    error,
    mutate,
  } = useSWR<Comentario[]>(`/api/items/${itemId}/comments`, fetcher);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit({ conteudo }: FormValues) {
    const { ok, body } = await enviarComentario(itemId, conteudo);

    if (!ok) {
      setError("conteudo", {
        message: body?.error ?? "Não foi possível enviar o comentário.",
      });
      return;
    }

    mutate([...(comentarios ?? []), { ...body, replies: [] }], {
      revalidate: false,
    });
    reset();
  }

  return (
    <section>
      <p className="mb-2 text-lg font-bold text-reuse-text">Comentários</p>

      {isLoading && (
        <p className="text-sm text-reuse-text-secondary">
          Carregando comentários...
        </p>
      )}

      {error && !isLoading && (
        <p className="text-sm text-reuse-danger">
          Não foi possível carregar os comentários.
        </p>
      )}

      {!isLoading && !error && comentarios?.length === 0 && (
        <p className="text-sm text-reuse-text-secondary">
          {isOwner
            ? "Ainda não há perguntas sobre este item."
            : "Seja o primeiro a comentar neste item."}
        </p>
      )}

      {!isLoading && !error && comentarios && comentarios.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {comentarios.map((comentario) => (
            <ComentarioCard
              key={comentario.id}
              comentario={comentario}
              itemId={itemId}
              mutate={mutate}
            />
          ))}
        </div>
      )}

      {!isOwner && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <textarea
            placeholder="Escreva um comentário..."
            className={`${textAreaClass} mb-2`}
            {...register("conteudo", {
              required: "Escreva algo antes de enviar.",
            })}
          />

          {errors.conteudo?.message && (
            <p className="mb-2 text-xs text-reuse-danger">
              {errors.conteudo.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-reuse-green-dark px-4 py-2 text-sm font-bold text-white transition duration-150 active:scale-[0.97] disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Comentar"}
          </button>
        </form>
      )}
    </section>
  );
}
