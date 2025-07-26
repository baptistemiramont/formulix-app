import { createContext } from "react";

import type { TDataState } from "@/providers/DataProvider";

export const DataContext = createContext<TDataState | undefined>(undefined);
