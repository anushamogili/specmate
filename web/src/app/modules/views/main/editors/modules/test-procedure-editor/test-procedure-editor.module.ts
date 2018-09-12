import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from 'ng2-dragula';
import { MaximizeButtonModule } from '../maximize-button/maximize-button.module';
import { TestCaseParameterMappingModule } from '../test-case-parameter-mapping/test-case-parameter-mapping.module';
import { TestProcedureEditor } from './components/test-procedure-editor.component';
import { TestStepRow } from './components/test-step-row.component';

@NgModule({
  imports: [
    // MODULE IMPORTS
    BrowserModule,
    AngularSplitModule,
    MaximizeButtonModule,
    DragulaModule,
    TestCaseParameterMappingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    // COMPONENTS IN THIS MODULE
    TestProcedureEditor,
    TestStepRow
  ],
  exports: [
    // THE COMPONENTS VISIBLE TO THE OUTSIDE
    TestProcedureEditor
  ],
  providers: [
    // SERVICES
  ],
  bootstrap: [
    // COMPONENTS THAT ARE BOOTSTRAPPED HERE
  ]
})

export class TestProcedureEditorModule { }
