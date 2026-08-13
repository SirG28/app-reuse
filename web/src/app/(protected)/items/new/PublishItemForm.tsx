"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createItemAction } from "@/app/actions/items";
import ScreenHeader from "@/components/ScreenHeader";
import PrimaryButton from "@/components/PrimaryButton";
import { inputClass, inputHeightClass, labelClass, textAreaClass } from "@/lib/formStyles";

export default function PublishItemForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createItemAction, undefined);
  const [imagem, setImagem] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <>
      <ScreenHeader
        title="Publicar item"
        backHref="/home"
        right={
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="text-xl text-reuse-green"
            aria-label="Fechar"
          >
            ×
          </button>
        }
      />

      <form action={formAction} className="px-4 pb-20 pt-[18px]">
        <div className="mb-6 flex h-[190px] w-full items-center justify-center overflow-hidden bg-[#ECECEC]">
          {imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagem}
              alt="Pré-visualização do item"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-full w-full bg-[#E9E9E9]" />
          )}
        </div>

        <label className={labelClass} htmlFor="imagem">
          URL da foto (opcional)
        </label>
        <input
          id="imagem"
          name="imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          placeholder="https://exemplo.com/foto.jpg"
          className={`${inputClass} ${inputHeightClass} mb-6`}
        />

        <h2 className="mb-3.5 text-lg font-bold text-reuse-text">Produto</h2>

        <label className={labelClass} htmlFor="titulo">
          Título do Produto
        </label>
        <input
          id="titulo"
          name="titulo"
          placeholder="Ex.: Quadro decorativo"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        />

        <label className={labelClass} htmlFor="descricao">
          Descrição do Produto
        </label>
        <textarea
          id="descricao"
          name="descricao"
          placeholder="Ex.: 32cm x 24cm, moldura de madeira e pintura feita de acrílico."
          className={`${textAreaClass} mb-3.5`}
        />

        <h2 className="mb-3.5 text-lg font-bold text-reuse-text">Troca</h2>

        <label className={labelClass} htmlFor="troca">
          Trocas que você aceita
        </label>
        <textarea
          id="troca"
          name="troca"
          placeholder="Ex.: Quadros semelhantes ou outras decorações de parede"
          className={`${textAreaClass} mb-3.5`}
        />

        <h2 className="mb-3.5 text-lg font-bold text-reuse-text">
          Formas de contato
        </h2>

        <label className={labelClass} htmlFor="whatsapp">
          WhatsApp (Obrigatório)
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          placeholder="(xx) x xxxx-xxxx"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        />

        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoCapitalize="none"
          placeholder="lorem@gmail.com"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        />

        {state?.error && (
          <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
            {state.error}
          </p>
        )}

        <div className="mt-3.5">
          <PrimaryButton disabled={pending}>
            {pending ? "Publicando..." : "+   Publicar item"}
          </PrimaryButton>
        </div>
      </form>

      {showExitModal && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/35 px-2.5">
          <div className="w-full max-w-md rounded-t-3xl bg-white px-[22px] pb-6 pt-5">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="text-2xl text-reuse-text"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <p className="mb-3.5 text-xl font-bold leading-tight text-reuse-text">
              Você deseja continuar a publicação desse item?
            </p>
            <p className="mb-7 text-[15px] leading-relaxed text-reuse-text">
              Ao sair dessa tela, você cancelará a publicação desse item
            </p>

            <button
              type="button"
              onClick={() => setShowExitModal(false)}
              className="mb-2.5 w-full rounded-lg bg-reuse-green-accent py-3.5 text-[13px] font-bold text-white"
            >
              Sim, voltar para publicação
            </button>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="w-full rounded-lg border border-reuse-green-accent py-3.5 text-[13px] font-bold text-reuse-green-accent"
            >
              Não, sair e cancelar item
            </button>
          </div>
        </div>
      )}
    </>
  );
}
