import { useContext, createContext } from "react";

export const AppContext = createContext(null);
// export const AppContext = React.createContext({});

export function useAppContext() {
	return useContext(AppContext);
}
