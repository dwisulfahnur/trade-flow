'use client';

import { Fragment, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import ApiKeyFormDialog from "./ApiKeyFormDialog";
export default function ApiKeySettings() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <ApiKeyFormDialog open={openDialog} onClose={() => setOpenDialog(false)} />
      <Box>
        <Button size={'xs'} variant={'surface'} onClick={() => setOpenDialog(true)}>Add API Key</Button>
      </Box>
    </>
  )
}
