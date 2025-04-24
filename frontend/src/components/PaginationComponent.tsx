import { ChevronsRight, ChevronsLeft } from 'lucide-react';

type PaginationComponentProps = {
    pageCount: number;
    pageNumber: number;
    changePageFunc: (page: number) => void;
};

function PaginationComponent(props: PaginationComponentProps) {
    const { pageCount, pageNumber, changePageFunc } = props;

    const createPageNumbers = () => {
        let pageNumbers = [];
        if (pageCount <= 5) {
            // If total pages are 5 or less, show all pages
            pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
        } else {
            // Always show first, last, current, and one page around current
            pageNumbers = [1, pageCount];

            if (pageNumber > 2) {
                pageNumbers.push(pageNumber - 1);
            }
            if (pageNumber !== 1 && pageNumber !== pageCount) {
                pageNumbers.push(pageNumber);
            }
            if (pageNumber < pageCount - 1) {
                pageNumbers.push(pageNumber + 1);
            }

            pageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

            const finalPageNumbers = [];
            let lastPage = 0;
            for (let i = 0; i < pageNumbers.length; i++) {
                if (pageNumbers[i] - lastPage > 1) {
                    finalPageNumbers.push('...');
                }
                finalPageNumbers.push(pageNumbers[i]);
                lastPage = pageNumbers[i];
            }
            pageNumbers = finalPageNumbers;
        }
        return pageNumbers;
    };

    const pageNumbers = createPageNumbers();

    return (
        <ul className="list-none flex justify-center items-center">
            <li onClick={() => pageNumber > 1 && changePageFunc(pageNumber - 1)}
                className="mr-2"
            >
                <button className='flex items-center'>
                    <ChevronsLeft />
                </button>
            </li>
            {pageNumbers.map((page, index) => (
                <li
                    key={index}
                    onClick={() => typeof page === 'number' && changePageFunc(page)}
                    className={`flex items-center justify-center border-4 w-10 h-10 ${page === pageNumber ? 'bg-gray-300' : ''}`}
                >
                    {page === '...' ? (
                        <div className='flex items-center'>
                            {page}

                        </div>
                    ) : (
                        <button className='flex items-center'>
                            {page}
                        </button>
                    )}
                </li>
            ))}
            <li onClick={() => pageNumber < pageCount && changePageFunc(pageNumber + 1)}
                className="ml-2"
            >
                <button className='flex items-center'>
                    <ChevronsRight />
                </button>
            </li>
        </ul>
    );
}

export default PaginationComponent;
