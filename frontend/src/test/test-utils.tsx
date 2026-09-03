import { render } from "@testing-library/react";
import type { ReactElement } from "react";

function customRender(ui: ReactElement) {
  return render(ui);
}

export { customRender as render };