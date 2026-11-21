"use client";

// Server components must not import from "antd" directly: doing so turns the
// whole antd barrel into a client reference and ships every component.
import { App } from "antd";

export default function AntdAppProvider({ children }) {
  return <App>{children}</App>;
}
