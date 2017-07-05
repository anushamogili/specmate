import {IContentElement} from '../../model/IContentElement';
import { CEGEffectNode } from '../../model/CEGEffectNode';
import { CEGCauseNode } from '../../model/CEGCauseNode';
import { CEGNode } from '../../model/CEGNode';
import { Type } from '../../util/Type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/switchMap';
import { Config } from '../../config/config';
import { CEGModel } from '../../model/CEGModel';
import { IContainer } from '../../model/IContainer';
import { Requirement } from '../../model/Requirement';
import { TestSpecification } from '../../model/TestSpecification';
import { SpecmateDataService } from '../../services/specmate-data.service';
import { Id } from '../../util/Id';
import { Url } from '../../util/Url';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationModal } from "../core/forms/confirmation-modal.service";
import { EditorCommonControlService } from '../../services/editor-common-control.service'


@Component({
    moduleId: module.id,
    selector: 'requirements-details',
    templateUrl: 'requirement-details.component.html',
    styleUrls: ['requirement-details.component.css']
})

export class RequirementsDetails implements OnInit {

    requirement: Requirement;
    contents: IContentElement[];
    allTestSpecifications: TestSpecification[];

    cegModelType = CEGModel;

    private canGenerateTestSpecMap: { [url: string]: boolean } = {};

    constructor(private dataService: SpecmateDataService, private router: Router, private route: ActivatedRoute, private modal: ConfirmationModal, private editorCommonControlService: EditorCommonControlService) { }

    ngOnInit() {
        this.editorCommonControlService.showCommonControls = false;
        this.editorCommonControlService.isCurrentEditorValid = false;
        this.route.params
            .switchMap((params: Params) => this.dataService.readElement(Url.fromParams(params)))
            .subscribe((requirement: IContainer) => {
                this.requirement = requirement as Requirement;
                this.dataService.readContents(requirement.url).then((
                    contents: IContainer[]) => {
                    this.contents = contents;
                    for (let i = 0; i < this.contents.length; i++) {
                        let currentElement: IContainer = this.contents[i];
                        if (!Type.is(currentElement, CEGModel)) {
                            continue;
                        }
                        this.initCanCreateTestSpec(currentElement);
                    }
                });
                this.readAllTestSpecifications();
            });
    }

    private readAllTestSpecifications(){
        this.dataService.performQuery(this.requirement.url,"listRecursive",{class:"TestSpecification"}).then(
            (testSpecifications: TestSpecification[]) => {this.allTestSpecifications = testSpecifications;}
        )
    }

    initCanCreateTestSpec(currentElement: IContainer): void {
        this.dataService.readContents(currentElement.url).then((contents: IContainer[]) => {
            let hasSingleNode: boolean = contents.some((element: IContainer) => {
                let isNode: boolean = (Type.is(element, CEGNode) || Type.is(element, CEGCauseNode) || Type.is(element, CEGEffectNode));
                if (!isNode) {
                    return false;
                }
                let node: CEGNode = element as CEGNode;
                let hasIncomingConnections: boolean = node.incomingConnections && node.incomingConnections.length > 0;
                let hasOutgoingConnections: boolean = node.outgoingConnections && node.outgoingConnections.length > 0;
                return !hasIncomingConnections && !hasOutgoingConnections;
            });
            this.canGenerateTestSpecMap[currentElement.url] = !hasSingleNode && contents.length > 0;
        });
    }

    delete(element: IContentElement): void {
        this.modal.open("Do you really want to delete " + element.name + "?")
            .then(() => this.dataService.deleteElement(element.url, true))
            .then(() => this.dataService.commit('Delete'))
            .then(() => this.dataService.readContents(this.requirement.url, true))
            .then((contents: IContainer[]) => this.contents = contents)
            .then(()=>this.readAllTestSpecifications())
            .catch(() => { });
    }

    createModel(): void {
        if (!this.contents) {
            return;
        }
        let model: CEGModel = new CEGModel();
        model.id = Id.generate(this.contents, Config.CEG_MODEL_BASE_ID);
        let modelUrl: string = Url.build([this.requirement.url, model.id]);
        model.url = modelUrl;
        model.name = Config.CEG_NEW_MODEL_NAME;
        model.description = Config.CEG_NEW_NODE_DESCRIPTION;

        this.dataService.createElement(model, true)
            .then(() => this.dataService.readContents(model.url, true))
            .then((contents: IContainer[]) => this.contents = contents)
            .then(() => this.dataService.commit('Create'))
            .then(() => this.router.navigate(['/requirements', { outlets: { 'main': [modelUrl, 'ceg'] } }]));
    }

    canCreateTestSpecification(ceg: CEGModel): boolean {
        return this.canGenerateTestSpecMap[ceg.url];
    }

    generateTestSpecification(ceg: CEGModel): void {
        if (!this.contents) {
            return;
        }
        if(!this.canCreateTestSpecification(ceg)) {
            return;
        }
        let testSpec: TestSpecification = new TestSpecification();
        testSpec.name = Config.TESTSPEC_NAME;
        testSpec.description = Config.TESTSPEC_DESCRIPTION;

        this.dataService.readContents(ceg.url)
            .then((contents: IContainer[]) => {
                testSpec.id = Id.generate(contents, Config.TESTSPEC_BASE_ID);
                testSpec.url = Url.build([ceg.url, testSpec.id]);
            })
            .then(() => this.dataService.createElement(testSpec, true))
            //TODO: update list of all specifications
            .then(() => this.dataService.commit('Create'))
            .then(() => this.dataService.performOperations(testSpec.url, "generateTests"))
            .then(() => this.router.navigate(['/tests', { outlets: { 'main': [testSpec.url] } }]));
    }

    createTestSpecification(): void {
        if (!this.contents) {
            return;
        }

        let testSpec: TestSpecification = new TestSpecification();
        testSpec.name = Config.TESTSPEC_NAME;
        testSpec.description = Config.TESTSPEC_DESCRIPTION;

        this.dataService.readContents(this.requirement.url)
            .then((contents: IContainer[]) => {
                testSpec.id = Id.generate(contents, Config.TESTSPEC_BASE_ID);
                testSpec.url = Url.build([this.requirement.url, testSpec.id]);
            })
            .then(() => this.dataService.createElement(testSpec, true))
            //TODO: update list of all specifications
            .then(() => this.dataService.commit('Create'))
            .then(() => this.router.navigate(['/tests', { outlets: { 'main': [testSpec.url] } }]));
    }


}
