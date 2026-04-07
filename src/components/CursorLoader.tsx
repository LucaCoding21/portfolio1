"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function CursorLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  return show ? <CustomCursor /> : null;
}
