import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
@Injectable()
export class RecipesService {
  private readonly API_BASE_URL: string;

  constructor(private configService: ConfigService, private logger: Logger) {
    this.API_BASE_URL = this.configService.get<string>('API_BASE_URL')|| "";
  }

  async getAllRecipes() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/search.php?s=`);
      return response.data;
    } catch (error) {
      throw new HttpException('Error fetching recipes', HttpStatus.BAD_REQUEST);
    }
  }

  async getRecipes(filterType?: string, filterValue?: string) {
    let url = `${this.API_BASE_URL}/search.php?s=`;
    this.logger.log(`Fetching recipes with filter: ${filterType}=${filterValue}`);
    if (filterType && filterValue) {
      const filterMap = {
        ingredient: `filter.php?i=${filterValue}`,
        country: `filter.php?a=${filterValue}`,
        category: `filter.php?c=${filterValue}`,
      };
      url = `${this.API_BASE_URL}/${filterMap[filterType]}`;
    }

    try {
      const { data } = await axios.get(url);
      return data.meals || [];
    } catch (error) {
      throw new HttpException('Failed to fetch recipes', HttpStatus.BAD_REQUEST);
    }
  }

  async getRecipeById(id: string) {
    try {
      const { data } = await axios.get(`${this.API_BASE_URL}/lookup.php?i=${id}`);
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }
  }
}
