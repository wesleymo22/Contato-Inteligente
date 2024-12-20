import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { BadGatewayException } from '@nestjs/common';

describe('GithubService', () => {
  let service: GithubService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve buscar os repositórios e transformá-los corretamente', async () => {
    const mockResponse: AxiosResponse = {
      data: [
        {
          name: 'Repo1',
          description: 'Desc1',
          language: 'C#',
          created_at: '2022-01-01T00:00:00Z',
        },
        {
          name: 'Repo2',
          description: 'Desc2',
          language: 'C#',
          created_at: '2023-01-01T00:00:00Z',
        },
        {
          name: 'Repo3',
          description: 'Desc3',
          language: 'JavaScript',
          created_at: '2021-01-01T00:00:00Z',
        },
      ],
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders({}),
      config: { headers: new AxiosHeaders({}) },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getRepositories();

    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.github.com/orgs/takenet/repos',
      {
        params: { per_page: 10 },
      },
    );
    expect(result).toEqual([
      {
        name: 'Repo1',
        description: 'Desc1',
        language: 'C#',
        date: '2022-01-01T00:00:00Z',
      },
      {
        name: 'Repo2',
        description: 'Desc2',
        language: 'C#',
        date: '2023-01-01T00:00:00Z',
      },
    ]);
  });

  it('deve lançar uma exceção ao receber erro da API', async () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw { response: { data: { message: 'Erro na API' } } };
    });

    await expect(service.getRepositories()).rejects.toThrow(
      BadGatewayException,
    );
  });
});
