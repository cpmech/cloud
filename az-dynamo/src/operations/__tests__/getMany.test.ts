import AWS from 'aws-sdk';
import { getMany } from '../getMany';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

const data1 = {
  itemId: '101',
  aspect: 'PRODUCT',
  indexSK: '2020-01-19T01:02:01Z',
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
  itemId: '102',
  aspect: 'PRODUCT',
  indexSK: '2020-01-19T01:02:02Z',
  Title: 'Book 102 Title',
  ISBN: '222-2222222222',
  Authors: ['Author1', 'Author2'],
  Price: 20,
  Dimensions: '8.5 x 11.0 x 0.8',
  PageCount: 600,
  InPublication: true,
  ProductCategory: 'Book',
};

describe('getMany', () => {
  it('should get items', async () => {
    const keys = [
      { itemId: '101', aspect: 'PRODUCT' },
      { itemId: '102', aspect: 'PRODUCT' },
    ];
    const res = await getMany(tableName, keys);
    expect(res).toEqual([data1, data2]);
  });

  it('should get items, but not all attributes', async () => {
    const keys = [
      { itemId: '101', aspect: 'PRODUCT' },
      { itemId: '102', aspect: 'PRODUCT' },
    ];
    const res = await getMany(tableName, keys, 'itemId,Authors,PageCount');
    expect(res).toEqual([
      {
        itemId: data1.itemId,
        Authors: data1.Authors,
        PageCount: data1.PageCount,
      },
      {
        itemId: data2.itemId,
        Authors: data2.Authors,
        PageCount: data2.PageCount,
      },
    ]);
  });

  it('should handle missing items', async () => {
    const keys = [
      { itemId: '101', aspect: 'PRODUCT' },
      { itemId: '222', aspect: 'PRODUCT' },
    ];
    const res = await getMany(tableName, keys);
    expect(res).toEqual([data1]);
  });

  it('should handle all inexistent items', async () => {
    const keys = [
      { itemId: '111', aspect: 'PRODUCT' },
      { itemId: '222', aspect: 'PRODUCT' },
    ];
    const res = await getMany(tableName, keys);
    expect(res).toEqual([]);
  });

  it('should throw error if we try to get more than 100 items', async () => {
    const keys = [];
    for (let i = 0; i < 110; i++) {
      keys.push({ itemId: `${101 + i}`, aspect: 'PRODUCT' });
    }
    await expect(getMany(tableName, keys, 'Id')).rejects.toThrowError(
      'Too many items requested for the BatchGetItem call',
    );
  });
});
