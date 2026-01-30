import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useTranslations } from "next-intl"

type Props = {
  open: boolean
  platform?: string
  handleClose: () => void
  onConfirm?: () => void
  onCancel?: () => void
}

const CustomModal = ({
  open,
  platform,
  handleClose,
  onConfirm,
  onCancel,
}: Props) => {
  const t = useTranslations("home.download")
  const t2 = useTranslations("dashboard.chatButtons")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[18px] font-lucida text-telegram-blue w-[90%]">
            {t("title", { platform: platform || "" })}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-[15px] font-lucida">
            {t("description", { platform: platform || "" })}
          </DialogDescription>
        </DialogHeader>
        {onConfirm && onCancel && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              {t2("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => onConfirm()}
              className="cursor-pointer"
            >
              {t2("confirm")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
