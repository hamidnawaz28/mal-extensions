import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import { ActionButton, Modal } from "../common/components";
import React from 'react'

const ContentScript = () => {
  const [show, setShow] = useState(false)

  const onClickHandle = async () => { setShow(prevValue => !prevValue) };

  return (
    <Box>
      <ActionButton onClick={onClickHandle} label={"Show"} />
      <Modal show={show} setShow={onClickHandle} >
        <Box>Please 30 mint sa upper hogay hain</Box>
      </Modal>

    </Box>
  );
};

export default ContentScript;
