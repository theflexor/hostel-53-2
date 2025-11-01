"use client"

import { useTranslation } from "react-i18next"

export function PrivacyPolicyPage() {
  const { t } = useTranslation()

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto prose lg:prose-lg">
          <h1>{t("privacyPolicyTitle")}</h1>
          <p>
            <strong>{t("privacyPolicyLastUpdated")}:</strong> 2024-07-21
          </p>

          <h2>1. {t("information")}</h2>
          <p>{t("privacyPolicyP1")}</p>

          <h2>2. {t("howWeUseYourInformation")}</h2>
          <p>{t("privacyPolicyP2")}</p>

          <h2>3. {t("informationSharing")}</h2>
          <p>{t("privacyPolicyP3")}</p>

          <h2>4. {t("dataSecurity")}</h2>
          <p>{t("privacyPolicyP4")}</p>
        </div>
      </div>
    </div>
  )
}
