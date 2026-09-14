import { Button } from "@/components/ui/button";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";

interface MemberIdentityPreviewProps {
  nameJa: string;
  nameZh?: string;
  nameKana?: string;
  nameRomanized?: string;
}

export function MemberIdentityPreview({
  nameJa,
  nameZh,
  nameKana,
  nameRomanized,
}: MemberIdentityPreviewProps) {
  const primaryName = nameJa;
  const chineseName = nameZh && nameZh !== primaryName ? nameZh : undefined;
  const hasSupplementaryIdentity = Boolean(
    chineseName || nameKana || nameRomanized,
  );

  const identityHeader = (
    <span className="font-heading text-lg font-semibold leading-snug">
      {primaryName}
    </span>
  );

  if (!hasSupplementaryIdentity) {
    return (
      <div className="flex min-h-9 min-w-0 items-center px-0 py-0.5">
        {identityHeader}
      </div>
    );
  }

  return (
    <PreviewCard>
      <PreviewCardTrigger
        closeDelay={125}
        delay={100}
        render={
          <Button
            aria-label={`查看${primaryName}的姓名详情`}
            className="h-auto min-h-9 w-full justify-start whitespace-normal border-transparent px-0 py-0.5 text-start hover:bg-accent/60"
            type="button"
            variant="ghost"
          />
        }
      >
        {identityHeader}
      </PreviewCardTrigger>

      <PreviewCardPopup align="start" className="w-72">
        <dl className="flex min-w-0 flex-col gap-2 text-sm">
          {chineseName && (
            <div className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
              <dt className="text-muted-foreground">中文名</dt>
              <dd className="min-w-0 font-medium">{chineseName}</dd>
            </div>
          )}
          {nameKana && (
            <div className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
              <dt className="text-muted-foreground">Kana</dt>
              <dd className="min-w-0 font-medium">{nameKana}</dd>
            </div>
          )}
          {nameRomanized && (
            <div className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
              <dt className="text-muted-foreground">Romanized</dt>
              <dd className="min-w-0 font-medium">{nameRomanized}</dd>
            </div>
          )}
        </dl>
      </PreviewCardPopup>
    </PreviewCard>
  );
}
