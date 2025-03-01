import { Controller, Get, Query, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getAllRecipes() {
    return this.recipesService.getAllRecipes();
  }

  @Get('/filter')
  async getRecipes(@Query('type') type?: string, @Query('value') value?: string) {
    return this.recipesService.getRecipes(type, value);
  }

  @Get(':id')
  async getRecipe(@Param('id') id: string) {
    return this.recipesService.getRecipeById(id);
  }
}
