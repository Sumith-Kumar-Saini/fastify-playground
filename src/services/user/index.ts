import { Model } from 'mongoose';
import { IUserDoc } from '../../models/user';

interface PaginatedParams {
  page: number;
  limit: number;
}

export async function getPaginatedUsers(params: PaginatedParams, User: Model<IUserDoc>) {
  const { limit = 10, page = 1 } = params;

  if (page < 1 || limit < 1) throw new Error('Page and limit must be positive integers');

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);

  const shouldQuery = page <= totalPages && totalUsers > 0;
  const data = shouldQuery
    ? await User.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
    : [];

  return {
    data,
    meta: {
      page,
      limit,
      totalUsers,
      totalPages,
    },
  };
}
