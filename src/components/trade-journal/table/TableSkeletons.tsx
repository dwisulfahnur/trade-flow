import { VStack, Card, Flex, Box, Table, Skeleton } from "@chakra-ui/react";

interface TableSkeletonsProps {
  isMobile: boolean;
  colors: {
    borderColor: string;
    skeletonStartColor: string;
    skeletonEndColor: string;
  };
}

export function TableSkeletons({ isMobile, colors }: TableSkeletonsProps) {
  if (isMobile) {
    return (
      <VStack align="stretch" spaceY={3}>
        {[...Array(5)].map((_, index) => (
          <Card.Root key={`skeleton-${index}`} mb={3} borderColor={colors.borderColor}>
            <Card.Body p={3}>
              <Flex justifyContent="space-between" mb={2}>
                <Skeleton
                  height="20px"
                  width="80px"
                  css={{
                    "--start-color": colors.skeletonStartColor,
                    "--end-color": colors.skeletonEndColor,
                  }}
                />
                <Skeleton
                  height="20px"
                  width="60px"
                  css={{
                    "--start-color": colors.skeletonStartColor,
                    "--end-color": colors.skeletonEndColor,
                  }}
                />
              </Flex>
              <Flex justifyContent="space-between" mb={2}>
                <Skeleton
                  height="20px"
                  width="50px"
                  css={{
                    "--start-color": colors.skeletonStartColor,
                    "--end-color": colors.skeletonEndColor,
                  }}
                />
                <Skeleton
                  height="20px"
                  width="70px"
                  css={{
                    "--start-color": colors.skeletonStartColor,
                    "--end-color": colors.skeletonEndColor,
                  }}
                />
              </Flex>
              <Flex justifyContent="space-between" mb={2}>
                <Skeleton
                  height="16px"
                  width="70px"
                  css={{
                    "--start-color": colors.skeletonStartColor,
                    "--end-color": colors.skeletonEndColor,
                  }}
                />
                <Skeleton
                  height="16px"
                  width="70px"
                  css={{
                    "--start-color": colors.skeletonStartColor,
                    "--end-color": colors.skeletonEndColor,
                  }}
                />
              </Flex>
              <Skeleton
                height="16px"
                width="100%"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Card.Body>
          </Card.Root>
        ))}
      </VStack>
    );
  }

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Date</Table.ColumnHeader>
          <Table.ColumnHeader>Symbol</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Price</Table.ColumnHeader>
          <Table.ColumnHeader>P&L</Table.ColumnHeader>
          <Table.ColumnHeader>Notes</Table.ColumnHeader>
          <Table.ColumnHeader width="60px"></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[...Array(5)].map((_, index) => (
          <Table.Row key={`skeleton-row-${index}`}>
            <Table.Cell>
              <Skeleton height="20px" width="80px"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="20px" width="70px"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="20px" width="50px"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="16px" width="80px" mb={1}
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
              <Skeleton height="16px" width="80px"
                css={{ "--start-color": colors.skeletonStartColor, "--end-color": colors.skeletonEndColor }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="20px" width="60px"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="16px" width="150px"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="24px" width="24px"
                css={{
                  "--start-color": colors.skeletonStartColor,
                  "--end-color": colors.skeletonEndColor,
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
} 