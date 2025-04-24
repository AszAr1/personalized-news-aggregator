import { useMutation } from '@tanstack/react-query';
import { incrementViewsCountRequest } from '../../api/requests/articles/incrementViewsCountRequest';
import { queryClient } from '../../App';
import { useToast } from '../../contexts/ToastContext';
import { Article } from '../../types/news';

export type useIncrementViewsProps = {
  article: Article
}

export const useIncrementViewsCount = ({article}: useIncrementViewsProps) => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => incrementViewsCountRequest({article: article}),
    onMutate: async () => {
      const previousArticle = queryClient.getQueryData<Article>(['article', article.id, article.views_count]);
      await queryClient.cancelQueries({ queryKey: ['article', article.id, article.views_count] });

      if (previousArticle) {
        queryClient.setQueryData(['article', article.id, article.views_count], {
          ...previousArticle,
          views_count: previousArticle.views_count + 1
        });
      }

      return { previousArticle };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', article.id, article.views_count],
        refetchType: 'active'
      });
      showToast({
        message: 'View count updated!',
        type: 'success'
      });
    },
    onError: (error: Error, variables, context) => {
      console.error('Failed to increment views:', error);
      if (context?.previousArticle) {
        queryClient.setQueryData(
          ['article', article.id, article.views_count],
          context.previousArticle
        );
      }

      showToast({
        message: error.message || 'Failed to update views count',
        type: 'error'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['article', article.id, article.views_count]
      });
    }
  });
};