import "./NavHeader.scss"
import React from 'react'
import { useUtils } from "/src/helpers/utils.js"
import { useLanguage } from "/src/providers/LanguageProvider.jsx"
import { useData } from "/src/providers/DataProvider.jsx"
import ImageView from "/src/components/generic/ImageView.jsx"
import StatusBadge from "/src/components/generic/StatusBadge.jsx"

function NavHeader({ shrink }) {
    const utils = useUtils()
    const { getTranslation } = useLanguage()
    const { getSettings } = useData()

    const settings = getSettings()
    const profile = settings.profile

    // ✅ 根據語言動態取得名字（若 locales 沒有 name，就 fallback 用 profile.name）
    const name = getTranslation(profile["locales"], "name") || profile.name

    const stylizedName = utils.parseJsonText(profile["stylizedName"])
    const role = utils.parseJsonText(getTranslation(profile["locales"], "role"))
    const pfpUrl = utils.resolvePath(profile["profilePictureUrl"])
    const logoUrl = utils.resolvePath(profile["logoUrl"])

    const status = settings.status
    const statusVisible = status["visible"]
    const statusAvailable = status["available"]
    const statusMessage = getTranslation(status["locales"], "message")

    return (
        <header className={`nav-header ${shrink ? "nav-header-shrink" : ""}`}>
            <ImageView
                src={pfpUrl}
                className={`img-view-avatar`}
                alt={name} // ✅ 使用動態語言的名字作為圖片替代文字
            />

            {statusVisible && (
                <StatusBadge
                    available={statusAvailable}
                    message={statusMessage}
                    smallMode={shrink}
                />
            )}

            <div className={`info mt-3 text-center`}>
                <h5 className={`name`}>
                    <ImageView
                        src={logoUrl}
                        alt={`logo`}
                        className={`img-view-logo me-1`}
                    />

                    
                    {/* 或使用以下這行來顯示名字文字版： */}
                    {<span>{name}</span> }
                </h5>

                <div className={`role`}>
                    <span>{role}</span>
                </div>
            </div>
        </header>
    )
}

export default NavHeader
