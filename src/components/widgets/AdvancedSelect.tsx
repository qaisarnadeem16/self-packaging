import Select, {
	CSSObjectWithLabel,
	GroupBase,
	Props,
	StylesConfig,
} from "react-select";
import React, { useEffect, useState } from "react";

interface ExtendedProps<T> {
	onOptionFocus?: (e: T) => void;
}

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth <= 600);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	return isMobile;
}

function createStyles<
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>
>(isMobile: boolean): StylesConfig<Option, IsMulti, Group> {
	return {
		container: (base) =>
		({
			...base,
			// minWidth: 50,
			maxWidth: 50,
			display: "flex",
			maxHeight: "fit-content",
		} as CSSObjectWithLabel),

		option: (base, state) =>
		({
			...base,
			backgroundColor: state.isFocused ? "#f4f4f4" : "white",
			color: "black",
			fontSize: isMobile ? "14px" : "16px",
			position: "relative",
			...(isMobile && {
				color: "transparent",
				"::after": {
					content:
						state.data && typeof (state.data as any).label === "string"
							? `"${(state.data as any).label.charAt(0)}"`
							: '""',
					position: "absolute",
					left: "12px",
					color: "black",
				},
			}),
			"&:hover": {
				backgroundColor: "#ddd",
			},
		} as CSSObjectWithLabel),

		singleValue: (base, state) =>
		({
			...base,
			fontSize: isMobile ? "14px" : "16px",
			position: "relative",
			...(isMobile && {
				color: "transparent",
				"::after": {
					content:
						state.data && typeof (state.data as any).label === "string"
							? `"${(state.data as any).label.charAt(0)}"`
							: '""',
					position: "absolute",
					left: "2px",
					color: "black",
				},
			}),
		} as CSSObjectWithLabel),

		valueContainer: (provided) => ({
			...provided,
		}),
	};
}

const AdvancedSelect = <
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>
>(
	props: Props<Option, IsMulti, Group> & ExtendedProps<Option>
) => {
	const isMobile = useIsMobile();

	return (
		<Select
			{...props}
			styles={{
				...createStyles<Option, IsMulti, Group>(isMobile),
				...props.styles,
			}}
		/>
	);
};

export default AdvancedSelect;
