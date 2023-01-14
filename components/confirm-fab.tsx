"use client";

import Button from "./button";

export default function ConfirmFab(props: { title: string }) {
  return (
    <Button bold color="fuchsia">
      <h3 className="text-extrabold text-xl">{props.title}</h3>
    </Button>
  );
}
