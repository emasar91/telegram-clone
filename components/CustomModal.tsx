import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useTranslations } from "next-intl"

type Props = {
  open: boolean
  platform: string
  handleClose: () => void
}

const CustomModal = ({ open, platform, handleClose }: Props) => {
  const t = useTranslations("home.download")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[18px] font-lucida text-telegram-blue">
            {t("title", { platform })}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-[15px] font-lucida">
            {t("description", { platform })}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
