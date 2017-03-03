import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { SpecmateDataService } from '../../services/specmate-data.service';
import { CEGModel } from '../../model/CEGModel';
import { Requirement } from '../../model/Requirement';
import { IContainer } from '../../model/IContainer';
import { Type } from '../../util/Type';
import { Url } from '../../util/Url';

@Component({
    moduleId: module.id,
    selector: 'ceg-editor',
    templateUrl: 'requirements-ceg-editor.component.html'
})
export class RequirementsCEGEditor implements OnInit {
    constructor(private dataService: SpecmateDataService, private route: ActivatedRoute, private location: Location) { }

    private model: CEGModel;
    private name: string;

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.dataService.getDetails(params['url']))
            .subscribe(object => {
                if (Type.is(object, CEGModel)) {
                    this.model = object as CEGModel;
                }
                else if (Type.is(object, Requirement)) {
                    this.model = new CEGModel();
                    this.model.name = "New Model";
                    this.model.url = object.url + '/' + this.model.name;
                }
            });
    }

    discard(): void {
        this.location.back();
    }
}