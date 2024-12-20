import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

describe('GithubController', () => {
  let controller: GithubController;
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [
        {
          provide: GithubService,
          useValue: {
            getRepositories: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GithubController>(GithubController);
    service = module.get<GithubService>(GithubService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o service para buscar os repositórios', async () => {
    const mockRepositories = [
      {
        name: 'Repo1',
        description: 'Desc1',
        language: 'C#',
        date: '2023-01-01T00:00:00Z',
      },
    ];
    jest.spyOn(service, 'getRepositories').mockResolvedValue(mockRepositories);

    const result = await controller.getRepositories();

    expect(service.getRepositories).toHaveBeenCalled();
    expect(result).toEqual(mockRepositories);
  });
});
