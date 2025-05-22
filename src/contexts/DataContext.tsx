import { createContext } from "react";

import type { TDataContext } from "@/providers/DataProvider";

export const DataContext = createContext<TDataContext | undefined>(undefined);
