'use client'

import { useUploadDialog } from '@/hooks/dialog/useUploadDialog'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { UploadForm } from '../form/UploadForm'

export const UploadDialog = () => {
  const uploadDialog = useUploadDialog()

  return (
    <Dialog
      open={uploadDialog.isOpen}
      onOpenChange={uploadDialog.onClose}
    >
      <DialogContent className={'bg-neutral-900'}>
        <DialogHeader>
          <DialogTitle>
            Add a song
          </DialogTitle>
          <DialogDescription>
            Upload an mp3 file
          </DialogDescription>
        </DialogHeader>
        <UploadForm
          onClose={uploadDialog.onClose}
        />
      </DialogContent>
    </Dialog>
  )
}