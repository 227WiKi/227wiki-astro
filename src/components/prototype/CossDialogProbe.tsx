import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader,
  DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export default function CossDialogProbe() {
  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" variant="outline" />}>
        Open Dialog
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Isolated React Island</DialogTitle>
          <DialogDescription>Coss Dialog + Base UI，在 Astro 页面中的独立交互组件。</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <p className="text-sm">此 Dialog 通过 client:idle 激活。页面 Layout 和普通 Wiki 内容保持静态 HTML。</p>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="ghost" />}>Close Dialog</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
