"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateItemAction, deleteItemAction } from "@/app/actions/items";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { comprimirImagem } from "@/lib/comprimirImagem";
import { CATEGORIAS } from "@/lib/categorias";
import type { Categoria } from "@prisma/client";
import {
  inputClass,
  inputHeightClass,
  labelClass,
  textAreaClass,
} from "@/lib/formStyles";

type Item = {
  id: string;
  titulo: string;
  descricao: string;
  troca: string;
  imagem: string | null;
  categoria: Categoria;
};

export default function ItemOwnerPanel({ item }: { item: Item }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editando, setEditando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [imagem, setImagem] = useState(item.imagem ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(updateItemAction, undefined);

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o modal e atualiza os dados exibidos em reação ao resultado da server action (useActionState), não a um evento que dá pra tratar diretamente
      setEditando(false);
      showToast("Item atualizado!");
      router.refresh();
    }
  }, [state, showToast, router]);

  function handleFotoSelecionada(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    comprimirImagem(file)
      .then(setImagem)
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => setImagem(reader.result as string);
        reader.readAsDataURL(file);
      });
  }

  return (
    <div className="mb-6 rounded-xl border border-reuse-border bg-white p-3.5">
      <p className="mb-3 text-sm text-reuse-text-secondary">
        Este item foi publicado por você.
      </p>

      <div className="flex gap-2.5">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="flex items-center justify-center gap-1.5"
          onClick={() => setEditando(true)}
        >
          <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zm.854.854L11.207 2l1.5 1.5.793-.793zM10.5 2.207 3 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293L12.5 5.207zm-9 9.5v-.007L4.207 12 3.5 11.293 1.5 11.5z" />
          </svg>
          Editar
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          className="flex items-center justify-center gap-1.5"
          onClick={() => setExcluindo(true)}
        >
          <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L13.882 4zM2.5 3h11V2h-11z" />
          </svg>
          Excluir
        </Button>
      </div>

      <Modal open={editando} onClose={() => setEditando(false)}>
        <p className="mb-4 text-lg font-bold text-reuse-text">Editar item</p>

        <form action={formAction}>
          <input type="hidden" name="id" value={item.id} />

          <div className="relative mb-3.5 flex h-[150px] w-full items-center justify-center overflow-hidden rounded-lg bg-reuse-neutral-200">
            {imagem ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagem}
                alt="Pré-visualização do item"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-reuse-surface-sunken" />
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute rounded-lg border border-reuse-green bg-white px-4 py-2 text-[13px] font-semibold text-reuse-green"
            >
              ＋ {imagem ? "Trocar foto" : "Adicionar foto"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFotoSelecionada}
            className="hidden"
          />
          <input type="hidden" name="imagem" value={imagem} />

          <label className={labelClass} htmlFor="edit-titulo">
            Título
          </label>
          <input
            id="edit-titulo"
            name="titulo"
            defaultValue={item.titulo}
            placeholder="Título do item"
            className={`${inputClass} ${inputHeightClass} mb-3.5`}
          />

          <label className={labelClass} htmlFor="edit-descricao">
            Descrição
          </label>
          <textarea
            id="edit-descricao"
            name="descricao"
            defaultValue={item.descricao}
            placeholder="Descrição do item"
            className={`${textAreaClass} mb-3.5`}
          />

          <label className={labelClass} htmlFor="edit-categoria">
            Categoria
          </label>
          <select
            id="edit-categoria"
            name="categoria"
            defaultValue={item.categoria}
            className={`${inputClass} ${inputHeightClass} mb-3.5`}
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.value} value={categoria.value}>
                {categoria.label}
              </option>
            ))}
          </select>

          <label className={labelClass} htmlFor="edit-troca">
            Troca por
          </label>
          <input
            id="edit-troca"
            name="troca"
            defaultValue={item.troca}
            placeholder="O que você aceita na troca"
            className={`${inputClass} ${inputHeightClass} mb-3.5`}
          />

          {state?.error && (
            <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
              {state.error}
            </p>
          )}

          <div className="flex gap-2.5">
            <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex-1" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={excluindo} onClose={() => setExcluindo(false)}>
        <p className="mb-3.5 text-xl font-bold leading-tight text-reuse-text">
          Excluir item
        </p>
        <p className="mb-7 text-[15px] leading-relaxed text-reuse-text">
          Tem certeza que deseja excluir &ldquo;{item.titulo}&rdquo;? Essa ação
          não pode ser desfeita.
        </p>

        <form
          action={deleteItemAction}
          onSubmit={() => showToast("Item excluído.")}
          className="mb-2.5"
        >
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="focus-ring w-full rounded-lg bg-reuse-danger py-3.5 text-[13px] font-bold text-white transition duration-150 hover:brightness-95 active:scale-[0.97]"
          >
            Sim, excluir item
          </button>
        </form>
        <Button type="button" variant="secondary" size="sm" fullWidth onClick={() => setExcluindo(false)}>
          Cancelar
        </Button>
      </Modal>
    </div>
  );
}
