import { useSyncExternalStore } from "react";

import {
	getInstallState,
	subscribeToInstall,
	type TInstallState,
} from "@/utils/install";

export const useInstall = (): TInstallState =>
	useSyncExternalStore(subscribeToInstall, getInstallState);
