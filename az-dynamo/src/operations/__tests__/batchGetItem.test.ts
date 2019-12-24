import AWS from 'aws-sdk';
import { getMany } from '../getMany';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_PRODUCTS = 'TEST_AZDB_PRODUCTS';

const data1 = {
  Id: 101,
  Title: 'Book 101 Title',
  ISBN: '111-1111111111',
  Authors: ['Author1'],
  Price: 2,
  Dimensions: '8.5 x 11.0 x 0.5',
  PageCount: 500,
  InPublication: true,
  ProductCategory: 'Book',
};

const data2 = {
  Id: 102,
  Title: 'Book 102 Title',
  ISBN: '222-2222222222',
  Authors: ['Author1', 'Author2'],
  Price: 20,
  Dimensions: '8.5 x 11.0 x 0.8',
  PageCount: 600,
  InPublication: true,
  ProductCategory: 'Book',
};

describe('batchGetItem', () => {
  it('should get items', async () => {
    const keys = [{ Id: 101 }, { Id: 102 }];
    const res = await getMany(TABLE_PRODUCTS, keys);
    expect(res).toEqual([data1, data2]);
  });

  it('should get items, but not all attributes', async () => {
    const keys = [{ Id: 101 }, { Id: 102 }];
    const res = await getMany(TABLE_PRODUCTS, keys, 'Id,Authors,PageCount');
    expect(res).toEqual([
      {
        Id: data1.Id,
        Authors: data1.Authors,
        PageCount: data1.PageCount,
      },
      {
        Id: data2.Id,
        Authors: data2.Authors,
        PageCount: data2.PageCount,
      },
    ]);
  });

  it('should handle missing items', async () => {
    const keys = [{ Id: 101 }, { Id: 222 }];
    const res = await getMany(TABLE_PRODUCTS, keys);
    expect(res).toEqual([data1]);
  });

  it('should handle all inexistent items', async () => {
    const keys = [{ Id: 111 }, { Id: 222 }];
    const res = await getMany(TABLE_PRODUCTS, keys);
    expect(res).toEqual([]);
  });

  it('should throw error if we try to get more than 100 items', async () => {
    const keys = [];
    for (let i = 0; i < 110; i++) {
      keys.push({ Id: 101 + i });
    }
    await expect(getMany(TABLE_PRODUCTS, keys, 'Id')).rejects.toThrowError(
      'Too many items requested for the BatchGetItem call',
    );
  });
});
