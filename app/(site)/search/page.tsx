import { Header } from '@/components/header/Header'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchContent } from '@/components/search/SearchContent'

export default async function SearchPage() {
  return (
    <div className={'bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto'}>
      <Header>
        <div className={'mb-2 flex flex-col gap-y-6'}>
          <h1 className={'text-white text-3xl font-semibold'}>
            Search
          </h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent />
    </div>
  )
}