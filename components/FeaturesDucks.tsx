import AnimationDuck from "./AnimationDuck"
import simple from "@/public/assets/images/simple.json"
import privateDuck from "@/public/assets/images/private.json"
import sync from "@/public/assets/images/sync.json"
import fast from "@/public/assets/images/fast.json"
import powerful from "@/public/assets/images/powerful.json"
import open from "@/public/assets/images/open.json"
import safe from "@/public/assets/images/safe.json"
import social from "@/public/assets/images/social.json"
import expressive from "@/public/assets/images/expressive.json"
import { useTranslations } from "next-intl"

// Hoist static formatter function to avoid re-creation on every render
const boldFormatter = (chunks: React.ReactNode) => (
  <span className="font-bold">{chunks}</span>
)

function FeaturesDucks() {
  const t = useTranslations("home.ducks")

  return (
    <div className="mt-4 m-auto mb-16 p-0 flex flex-wrap justify-center">
      <AnimationDuck
        title={t("simple.title")}
        subtitle={t.rich("simple.subtitle", {
          bold: boldFormatter,
        })}
        duck={simple}
      />
      <AnimationDuck
        title={t("private.title")}
        subtitle={t.rich("private.subtitle", {
          bold: boldFormatter,
        })}
        duck={privateDuck}
      />
      <AnimationDuck
        title={t("sync.title")}
        subtitle={t.rich("sync.subtitle", {
          bold: boldFormatter,
        })}
        duck={sync}
      />
      <AnimationDuck
        title={t("fast.title")}
        subtitle={t.rich("fast.subtitle", {
          bold: boldFormatter,
        })}
        duck={fast}
      />
      <AnimationDuck
        title={t("powerful.title")}
        subtitle={t.rich("powerful.subtitle", {
          bold: boldFormatter,
        })}
        duck={powerful}
      />
      <AnimationDuck
        title={t("open.title")}
        subtitle={t.rich("open.subtitle", {
          bold: boldFormatter,
        })}
        duck={open}
      />
      <AnimationDuck
        title={t("safe.title")}
        subtitle={t.rich("safe.subtitle", {
          bold: boldFormatter,
        })}
        duck={safe}
      />
      <AnimationDuck
        title={t("social.title")}
        subtitle={t.rich("social.subtitle", {
          bold: boldFormatter,
        })}
        duck={social}
      />
      <AnimationDuck
        title={t("expressive.title")}
        subtitle={t.rich("expressive.subtitle", {
          bold: boldFormatter,
        })}
        duck={expressive}
      />
    </div>
  )
}

export default FeaturesDucks
