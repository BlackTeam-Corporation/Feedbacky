import {ReactComponent as UndrawNoData} from "assets/svg/undraw/no_data.svg";
import axios from "axios";
import DangerousActionModal from "components/commons/DangerousActionModal";
import SafeAnchor from "components/commons/SafeAnchor";
import {SvgNotice} from "components/commons/SvgNotice";
import ComponentLoader from "components/ComponentLoader";
import BoardContext from "context/BoardContext";
import PageNodesContext from "context/PageNodesContext";
import React, {useContext, useEffect, useState} from 'react';
import {FaExclamation} from "react-icons/all";
import {Link} from "react-router-dom";
import {UiBadge, UiLoadingSpinner, UiTooltip} from "ui";
import {UiButton, UiElementDeleteButton} from "ui/button";
import {UiCol} from "ui/grid";
import {UiViewBox} from "ui/viewbox";
import {toastError, toastSuccess} from "utils/basic-utils";

const SocialLinksSubroute = () => {
    const {updateState, data: boardData} = useContext(BoardContext);
    const {setCurrentNode} = useContext(PageNodesContext);
    const [socialLinks, setSocialLinks] = useState({data: [], loaded: false, error: false});
    const [modal, setModal] = useState({open: false, data: -1, dataName: ""});
    useEffect(() => setCurrentNode("social"), [setCurrentNode]);
    const getQuota = () => 4 - socialLinks.data.length;
    useEffect(() => {
        axios.get("/boards/" + boardData.discriminator + "/socialLinks").then(res => {
            if (res.status !== 200) {
                setSocialLinks({...socialLinks, error: true});
                return;
            }
            res.data.sort((a, b) => (a.id > b.id) ? 1 : -1);
            setSocialLinks({...socialLinks, data: res.data, loaded: true});
        }).catch(() => setSocialLinks({...socialLinks, error: true}));
        // eslint-disable-next-line
    }, []);

    const renderSocialLinks = () => {
        if (socialLinks.data.length === 0) {
            return <SvgNotice Component={UndrawNoData} title={"No social links yet."} description={"How about creating one?"}/>
        }
        return socialLinks.data.map((link) => {
            return <div className={"d-inline-flex justify-content-center mr-2"} key={link.id}>
                <div className={"text-center"} id={"socialPreviewContainer"}>
                    <img className={"bg-dark rounded p-2"} alt={"Logo"} src={link.logoUrl} height={40} width={40}/>
                    <UiElementDeleteButton tooltipName={"Delete"} id={"social-" + link.id + "-del"}
                                           onClick={() => setModal({...modal, open: true, data: link.id, dataName: extractHostname(link.url)})}/>
                    <br/>
                    <SafeAnchor url={link.url}><UiBadge>{extractHostname(link.url)}</UiBadge></SafeAnchor>
                </div>
            </div>
        })
    };
    const renderContent = () => {
        if (socialLinks.error) {
            return <span className={"text-danger"}>Failed to obtain social links data</span>
        }
        return <ComponentLoader loaded={socialLinks.loaded} component={
            <UiCol xs={12}>
                <div className={"text-black-60 mb-1"}>Current Social Links ({getQuota()} left)</div>
                {renderSocialLinks()}
                <div>
                    {renderAddButton()}
                </div>
            </UiCol>
        } loader={<UiCol className={"text-center my-5 py-5"}><UiLoadingSpinner/></UiCol>}/>
    };
    const renderAddButton = () => {
        if (getQuota() <= 0) {
            return <UiTooltip id={"quota"} text={"Quota Limit Reached"}>
                <UiButton className={"m-0 mt-3 float-right"}><FaExclamation/> Add New</UiButton>
            </UiTooltip>
        }
        return <UiButton className={"m-0 mt-3 float-right"} as={Link} to={"/ba/" + boardData.discriminator + "/social/create"}>Add New</UiButton>
    };
    const extractHostname = (url) => {
        let hostname;
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
        return hostname.replace("www.", "");
    };
    const onSocialLinkDelete = () => {
        axios.delete("/socialLinks/" + modal.data).then(res => {
            if (res.status !== 204) {
                toastError();
                return;
            }
            const data = socialLinks.data.filter(item => item.id !== modal.data);
            setSocialLinks({...socialLinks, data});
            updateState({...boardData, socialLinks: data});
            toastSuccess("Social link deleted.");
        }).catch(err => toastError(err.response.data.errors[0]));
    };
    return <UiCol xs={12} md={9}>
        <DangerousActionModal id={"socialDel"} onHide={() => setModal({...modal, open: false})} isOpen={modal.open} onAction={onSocialLinkDelete}
                              actionDescription={<div>Social link <UiBadge>{modal.dataName}</UiBadge> will be <u>deleted</u>.</div>}/>
        <UiViewBox title={"Social Links"} description={"Edit links visible at your board page here."}>
            {renderContent()}
        </UiViewBox>
    </UiCol>
};

export default SocialLinksSubroute;