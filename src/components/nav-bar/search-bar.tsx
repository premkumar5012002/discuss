"use client";

import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  ListboxSection,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import debounce from "lodash.debounce";
import { Prisma, Subreddit } from "@prisma/client";
import { IconLoader2, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useCallback, useState } from "react";
import Link from "next/link";

type SearchResult = Subreddit & {
  _count: Prisma.SubredditCountOutputType;
};

export const SearchBar: FC = () => {
  const { isOpen, onOpenChange } = useDisclosure();

  const [searchInput, setSearchInput] = useState<string>("");

  const {
    refetch,
    isFetched,
    isFetching,
    data: queryResults,
  } = useQuery({
    enabled: false,
    queryKey: ["search"],
    queryFn: async () => {
      if (searchInput.length === 0) return [];
      const { data } = await axios.get<SearchResult[]>(
        `/api/search?q=${searchInput}`,
      );
      return data;
    },
  });

  const request = debounce(async () => refetch(), 300);

  const debounceRequest = useCallback(() => request(), []);

  const onModalClose = () => {
    setSearchInput("");
    onOpenChange();
  };

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        className="sm:hidden"
        onClick={onOpenChange}
      >
        <IconSearch size={18} />
      </Button>

      <Input
        readOnly
        labelPlacement="outside"
        startContent={<IconSearch size={18} />}
        placeholder="Search communities..."
        className="hidden w-72 sm:block"
        onClick={onOpenChange}
      />

      <Modal
        size="lg"
        isOpen={isOpen}
        onOpenChange={onModalClose}
        closeButton={<div></div>}
      >
        <ModalContent className="h-96 overflow-y-auto p-4">
          <Input
            variant="faded"
            value={searchInput}
            startContent={<IconSearch size={24} />}
            placeholder="Search communities..."
            onChange={(e) => {
              setSearchInput(e.target.value);
              debounceRequest();
            }}
          />

          {isFetching && (
            <div className="mx-auto flex items-center gap-2 pt-10">
              <IconLoader2 className="animate-spin" size={22} />
              <span>Loading...</span>
            </div>
          )}

          {isFetched && queryResults?.length === 0 && (
            <p className="mx-auto pt-10 text-lg font-medium text-default-500">
              No Results found...
            </p>
          )}

          {isFetched === false && isFetching === false && (
            <div className="flex flex-col items-center gap-3 pt-10">
              <IconSearch size={30} />
              <p className="mx-auto text-lg font-medium text-default-500">
                Try searching for communities...
              </p>
            </div>
          )}

          {queryResults && isFetching === false && queryResults.length > 0 && (
            <Listbox className="pt-2">
              <ListboxSection title="Communities">
                {queryResults.map((subreddit) => (
                  <ListboxItem
                    as={Link}
                    key={subreddit.id}
                    href={`/r/${subreddit.name}`}
                    onClick={onModalClose}
                  >
                    r/{subreddit.name}
                  </ListboxItem>
                ))}
              </ListboxSection>
            </Listbox>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
