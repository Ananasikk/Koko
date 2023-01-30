import { ComponentType, FC, ReactElement, useState } from "react";
import { UserContext, User as TUser } from "./UserContext";

export function withUser<TProps extends JSX.IntrinsicAttributes>(
    Component: ComponentType<TProps>
): FC<TProps> {
    return (props: TProps): ReactElement => {

        const [user, setUser] = useState<TUser | null>(null)
        const isLogged = !!user;

        return (
            <UserContext.Provider value={{
                user, setUser, isLogged
            }}>
                <Component {...props} />
            </UserContext.Provider>
        )
    }
}