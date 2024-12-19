import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
  private readonly BASE_URL = 'https://api.github.com/orgs/takenet/repos';

  constructor(private readonly httpService: HttpService) {}

  async getRepositories() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.BASE_URL}`, {
          params: { per_page: 100 },
        }),
      );

      const listRepositories = response.data
        .filter((repo) => repo.language === 'C#')
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .slice(0, 5);

      return listRepositories.map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
      }));
    } catch (error) {
      console.error(error.response?.data);
      const mensagem = error.response?.data?.message
        ? error.response.data.message
        : 'Falha ao buscar dados';
      throw new BadGatewayException(mensagem);
    }
  }
}
