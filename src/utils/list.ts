import type { TFilterOption } from "@/types/list";

// A filter's options as a select lists them, each with the number of items it would leave
export function toSelectOptions(
	options: TFilterOption[] = [],
	unnamedLabel = ""
): { label: string; value: string }[] {
	return options.map(({ value, label, count }) => ({
		value,
		label: `${label ?? unnamedLabel} (${count})`,
	}));
}
