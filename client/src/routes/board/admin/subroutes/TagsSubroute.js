import {ReactComponent as UndrawNoData} from "assets/svg/undraw/no_data.svg";
import axios from "axios";
import TagCreateModal from "components/board/admin/TagCreateModal";
import TagEditModal from "components/board/admin/TagEditModal";
import DangerousActionModal from "components/commons/DangerousActionModal";
import {SvgNotice} from "components/commons/SvgNotice";
import BoardContext from "context/BoardContext";
import PageNodesContext from "context/PageNodesContext";
import React, {useContext, useEffect, useState} from 'react';
import {FaEyeSlash, FaPen, FaUserTag} from "react-icons/all";
import {FaExclamation, FaTrashAlt} from "react-icons/fa";
import tinycolor from "tinycolor2";
import {UiBadge, UiClickableTip, UiTooltip} from "ui";
import {UiButton, UiLoadableButton} from "ui/button";
import {UiCol} from "ui/grid";
import {UiViewBox} from "ui/viewbox";
import {toastError, toastSuccess} from "utils/basic-utils";

const TagsSubroute = () => {
    const {data: boardData, updateState} = useContext(BoardContext);
    const {setCurrentNode} = useContext(PageNodesContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteModal, setDeleteModal] = useState({open: false, data: "", dataColor: {}});
    const getQuota = () => 10 - boardData.tags.length;
    useEffect(() => setCurrentNode("tags"), [setCurrentNode]);
    const onTagCreate = (data) => {
        updateState({...boardData, tags: boardData.tags.concat(data)});
    };
    const renderContent = () => {
        return <UiCol xs={12}>
            <span className={"mr-1 text-black-60"}>Tags Quota ({getQuota()} left)</span>
            <UiClickableTip id={"quota"} title={"Tags Quota"} description={"Amount of tags your board can have, you're limited to 10 tags per board."}/>
            {renderTags()}
            <br/>
            {renderNewTagButton()}
        </UiCol>
    };
    const renderTags = () => {
        if (boardData.tags.length === 0) {
            return <SvgNotice Component={UndrawNoData} title={"No tags yet."} description={"How about creating one?"}/>
        }
        return boardData.tags.map((tag, i) => {
            return <div key={i}>
                <UiBadge color={tinycolor(tag.color)}>{tag.name}</UiBadge>
                {!tag.roadmapIgnored ||
                <UiTooltip id={"tag" + i + "map"} text={"Ignores Roadmap"}>
                    <FaEyeSlash className={"fa-xs ml-1 red"}/>
                </UiTooltip>}
                {!tag.publicUse ||
                <UiTooltip id={"tag" + i + "public"} text={"Publicly Accessible"}>
                    <FaUserTag className={"fa-xs ml-1 blue"}/>
                </UiTooltip>}
                <UiTooltip id={"tag" + i + "edit"} text={"Edit Tag"}>
                    <FaPen className={"fa-xs ml-1 hoverable-option"} onClick={() => onTagEdit(tag)}/>
                </UiTooltip>
                <UiTooltip id={"tag" + i + "delete"} text={"Delete Tag"}>
                    <FaTrashAlt className={"fa-xs ml-1 hoverable-option"} onClick={() => setDeleteModal({open: true, data: tag.name, dataColor: tinycolor(tag.color)})}/>
                </UiTooltip>
            </div>
        });
    };
    const renderNewTagButton = () => {
        if (getQuota() <= 0) {
            return <UiTooltip id={"quota"} text={"Quota Limit Reached"}>
                <UiButton className={"m-0 mt-3 float-right"}><FaExclamation/> Add New</UiButton>
            </UiTooltip>
        }
        return <UiLoadableButton className={"m-0 mt-3 float-right"} onClick={() => {
            setModalOpen(true);
            return Promise.resolve();
        }}>Add New</UiLoadableButton>
    };
    const onTagEdit = (tag) => {
        setEditData(tag);
        setEditModalOpen(true);
    };
    const onEdit = (oldTag, tag) => {
        const tags = boardData.tags;
        const i = tags.indexOf(oldTag);
        tags[i] = tag;
        updateState({...boardData, tags});
    };
    const onTagDelete = () => {
        axios.delete("/boards/" + boardData.discriminator + "/tags/" + deleteModal.data).then(res => {
            if (res.status !== 204) {
                toastError();
                return;
            }
            updateState({...boardData, tags: boardData.tags.filter(item => item.name !== deleteModal.data)});
            toastSuccess("Tag permanently deleted.");
        }).catch(err => toastError(err.response.data.errors[0]));
    };
    return <React.Fragment>
        <TagCreateModal onTagCreate={onTagCreate} onHide={() => setModalOpen(false)} isOpen={modalOpen}/>
        <TagEditModal isOpen={editModalOpen} onHide={() => setEditModalOpen(false)} tag={editData} onEdit={onEdit}/>
        <DangerousActionModal id={"tagDel"} onHide={() => setDeleteModal({...deleteModal, open: false})} isOpen={deleteModal.open} onAction={onTagDelete}
                              actionDescription={<div>Tag <UiBadge color={deleteModal.dataColor}>{deleteModal.data}</UiBadge> will be <u>deleted from all ideas</u> and list of available tags.</div>}/>
        <UiCol xs={12} md={9}>
            <UiViewBox title={"Tags Management"} description={"Edit your board tags here."}>
                {renderContent()}
            </UiViewBox>
        </UiCol>
    </React.Fragment>
};

export default TagsSubroute;