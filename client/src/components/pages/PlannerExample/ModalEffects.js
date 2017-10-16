import React from "react";
import LoadingModal from "./LoadingModal";

export default function({ showLoading }) {
  return showLoading ? <LoadingModal /> : null;
}
