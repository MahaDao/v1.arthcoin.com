import React, { memo, useState, Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled from 'styled-components';

import {
  Dropdown,
  DefaultDropdown,
  Flex,
  Text,
  Grid
} from '@makerdao/ui-components-core';
import CDPList from 'components/CDPList';
import useMaker from 'hooks/useMaker';
import lang from 'languages';

import { ReactComponent as BorrowIcon } from 'images/active-borrow-icon.svg';
import { ReactComponent as ActiveHome } from 'images/active-home.svg';
import { ReactComponent as InactiveHome } from 'images/inactive-home.svg';

import { Routes } from '../utils/constants';

const StyledBorrowIcon = styled(BorrowIcon)`
  path {
    stroke: ${props => props.textcolor};
    fill: ${props => props.textcolor};
  }
`;

const CDPDropdown = memo(function({ textcolor, selected, account, children }) {
  const [show, setShow] = useState(false);
  return (
    <Dropdown
      hitBoxMargin="0px"
      show={show}
      trigger={
        <Flex
          alignItems="center"
          justifyContent="center"
          p="s"
          bg="black.500"
          borderRadius="4px"
          onClick={() => setShow(!show)}
        >
          <StyledBorrowIcon
            textcolor={textcolor}
            selected={selected}
            connected={account}
            onClick={() => setShow(!show)}
          />
        </Flex>
      }
    >
      <DefaultDropdown mt="0px">
        <Grid
          mt="0px"
          gridTemplateColumns="64px 64px"
          gridColumnGap="xs"
          gridRowGap="xs"
          onClick={() => setShow(!show)}
        >
          {children}
        </Grid>
      </DefaultDropdown>
    </Dropdown>
  );
});

const BorrowMobileNav = ({ viewedAddress, cdpId }) => {
  const { account } = useMaker();
  const { url } = useCurrentRoute();
  const onOverviewPage =
    account && url.pathname === `/${Routes.BORROW}/owner/${account.address}`;

  const selected = url.pathname.startsWith(`/${Routes.BORROW}`);
  const textColor =
    selected && account
      ? 'white'
      : !selected && account
      ? 'gray'
      : selected && !account
      ? 'black'
      : 'gray';

  const address = account
    ? account.address
    : viewedAddress
    ? viewedAddress
    : null;

  return (
    <Fragment>
      <Link href={`/${Routes.BORROW}`}>
        <Flex
          bg={!account && selected && 'grey.200'}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py="s"
        >
          <StyledBorrowIcon
            textcolor={textColor}
            selected={selected}
            connected={account}
          />
          <Text t="p6" fontWeight="bold" color={textColor}>
            {lang.navbar.borrow}
          </Text>
        </Flex>
      </Link>
      {selected && address ? (
        <CDPDropdown>
          <Link href={`/${Routes.BORROW}/owner/${address}`}>
            <Flex alignItems="center" justifyContent="center" py="s">
              {onOverviewPage ? <ActiveHome /> : <InactiveHome />}
            </Flex>
          </Link>

          <CDPList
            currentPath={url.pathname}
            currentQuery={url.search}
            viewedAddress={address}
          />
        </CDPDropdown>
      ) : null}
    </Fragment>
  );
};

export default BorrowMobileNav;