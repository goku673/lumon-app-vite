import React from "react";
import DetailInscriptionComponent from "../../../components/detailIncription";
import AuthGuard from "../../../components/AuthGuard";

const DetailInscription = () => (
  <AuthGuard>
    <DetailInscriptionComponent />
  </AuthGuard>
);

export default DetailInscription;