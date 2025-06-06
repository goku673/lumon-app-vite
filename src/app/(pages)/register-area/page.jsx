import React from "react";
import TabsRegister from "../../../components/tabsRegister";
import AuthGuard from "../../../components/AuthGuard";
const RegisterArea = () => {
    return (
        <AuthGuard>
          <TabsRegister />
        </AuthGuard>
            
    )         
}

export default RegisterArea;