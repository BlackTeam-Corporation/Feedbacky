import axios from "axios";
import ColorSelectionHelper from "components/commons/ColorSelectionHelper";
import BoardContext from "context/BoardContext";
import React, {useContext, useState} from 'react';
import Form from "react-bootstrap/Form";
import tinycolor from "tinycolor2";
import {UiClickableTip, UiCountableFormControl, UiModal} from "ui";
import {UiLoadableButton} from "ui/button";
import {UiCol, UiRow} from "ui/grid";
import {toastError, toastSuccess, toastWarning} from "utils/basic-utils";

const TagCreateModal = ({isOpen, onHide, onTagCreate}) => {
    const {data} = useContext(BoardContext);
    const [color, setColor] = useState("#0994f6");

    const handleSubmit = () => {
        const name = document.getElementById("tagNameTextarea").value;
        if (name.length < 3 || name.length > 20) {
            toastWarning("Tag name must be between 3 and 20 characters.");
            return Promise.resolve();
        }
        const roadmapIgnored = document.getElementById("roadmapIgnored").checked;
        const publicUse = document.getElementById("publicUse").checked;
        return axios.post("/boards/" + data.discriminator + "/tags", {
            name, color, roadmapIgnored, publicUse,
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                toastError();
                return;
            }
            onHide();
            onTagCreate(res.data);
            toastSuccess("Tag with name " + name + " created.");
        }).catch(err => toastError(err.response.data.errors[0]));
    };
    return <UiModal id={"tagCreate"} isOpen={isOpen} onHide={onHide} title={"Add new Tag"}
                    applyButton={<UiLoadableButton onClick={handleSubmit} className={"mx-0"}>Save</UiLoadableButton>}>
        <UiRow>
            <UiCol xs={12} className={"mt-2 mb-1"}>
                <Form.Label className={"mr-1 text-black-60"}>Tag Name</Form.Label>
                <UiClickableTip id={"tagName"} title={"Tag Name"} description={"Descriptive and under 20 characters name of tag."}/>
                <UiCountableFormControl id={"tagNameTextarea"} minLength={2} maxLength={15} placeholder={"Short and descriptive."}/>
            </UiCol>
            <UiCol xs={12} sm={6} className={"mb-2"}>
                <ColorSelectionHelper title={"Tag Color"} color={tinycolor(color)} setColor={setColor} colorWarning={true}/>
            </UiCol>
            <UiCol xs={12} sm={6} className={"mb-2"}>
                <div>
                    <Form.Label className={"mr-1 text-black-60"}>Ignore Roadmap</Form.Label>
                    <UiClickableTip id={"tagColor"} title={"Ignore Roadmap"} description={"Select if you don't want to include show tag and ideas with this tag in roadmap view."}/>
                    <br/>
                    <Form.Check id={"roadmapIgnored"} custom inline label={"Roadmap Ignored"} type={"checkbox"} defaultChecked={false}/>
                </div>
                <div className={"mt-2"}>
                    <Form.Label className={"mr-1 text-black-60"}>Publicly Accessbile</Form.Label>
                    <UiClickableTip id={"tagColor"} title={"Ignore Roadmap"} description={"Select if you want this tag to be selectable by users when they create new ideas."}/>
                    <br/>
                    <Form.Check id={"publicUse"} custom inline label={"Public Use"} type={"checkbox"} defaultChecked={false}/>
                </div>
            </UiCol>
        </UiRow>
    </UiModal>
};

export default TagCreateModal;