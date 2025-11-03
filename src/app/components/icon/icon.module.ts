import { NgModule } from "@angular/core";
import { GridIcon } from "./sidebar/grid-icon";
import { PlusIcon } from "./sidebar/plus-icon";
import { CheveronRightIcon } from "./sidebar/cheveron-right-icon";
import { MenuIconComponent } from "./sidebar/menu-icon";



@NgModule({
	imports: [
	CheveronRightIcon,
	PlusIcon,
	GridIcon,
	MenuIconComponent,
	],
	exports: [
	CheveronRightIcon,
	PlusIcon,
	GridIcon,
	MenuIconComponent
	]
})

export class IconModule { }