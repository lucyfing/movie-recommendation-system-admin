import { Movie, MovieList } from '@/lib/app-interface';
import { addRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Popconfirm, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import movieApi from '../../services/movie';
import utils from '../../utils/index';
import { MovieDetail } from './components/MovieDetail';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const TableList: React.FC = () => {
  // 新建窗口的弹窗
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [movieList, setMovieList] = useState<MovieList>();
  const [countryList, setCountryList] = useState<any>({});
  const [languageList, setLanguageList] = useState<any>({});
  const restFormRef = useRef<ProFormInstance>();

  const pageSize: number = 10;
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'doubanId',
      dataIndex: 'doubanId',
      hideInTable: true,
      search: false,
    },
    {
      title: '电影名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '简介',
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
      search: false,
    },
    {
      title: '评分',
      dataIndex: 'rate',
      valueType: 'select',
      valueEnum: {
        '0': { text: '0' },
        '1': { text: '1' },
        '2': { text: '2' },
        '3': { text: '3' },
        '4': { text: '4' },
        '5': { text: '5' },
        '6': { text: '6' },
        '7': { text: '7' },
        '8': { text: '8' },
        '9': { text: '9' },
        '10': { text: '10' },
      },
    },
    {
      title: '上映地区',
      dataIndex: 'countries',
      valueType: 'select',
      valueEnum: countryList,
      ellipsis: true,
      renderText: (value: [string]) => <>{value.join(',')}</>,
    },
    {
      title: '语言',
      dataIndex: 'languages',
      valueType: 'select',
      valueEnum: languageList,
      ellipsis: true,
      renderText: (value: [string]) => <>{value.join(',')}</>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          详情
        </a>,
        <Popconfirm
          title={`您确定要删除此条数据吗？`}
          onConfirm={() => deleteMovies(record.doubanId as unknown as string)}
          okText="确定"
          cancelText="取消"
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  // 获取电影列表
  const getMovieList = async (page?: number, pageSize?: number) => {
    const data = await movieApi.getAllMovies(page, pageSize);
    setMovieList(data);
  };
  useEffect(() => {
    getMovieList(1, pageSize);
    const getSearchList = async () => {
      const data = await movieApi.getAllCountry();
      setCountryList(data);
      const languageData = await movieApi.getAllLanguage();
      setLanguageList(languageData);
    };
    getSearchList();
  }, []);

  // 删除电影
  const deleteMovies = async (doubanIds: string[] | string) => {
    const deletedCount = await movieApi.delMovies(doubanIds);
    if (deletedCount > 0) {
      message.success('删除成功');
      getMovieList(movieList?.currentPage, pageSize);
    }
  };

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        options={false}
        actionRef={actionRef}
        rowKey="doubanId"
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={async () => {
                const values = form?.getFieldsValue();
                if (!!values.name) values.name = utils.escapeHtml(values.name);
                const page = movieList?.currentPage;
                const data = await movieApi.getFilterMovies({ ...values, page, pageSize });
                setMovieList(data);
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="reset"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
          ],
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> New
          </Button>,
        ]}
        dataSource={movieList?.movies as any}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space size={16}>
              <a onClick={onCleanSelected}>取消选择</a>
              <Popconfirm
                title={`您确定要删除这些数据吗？`}
                onConfirm={() => deleteMovies(selectedRowKeys as string[])}
                okText="确定"
                cancelText="取消"
              >
                <a>批量删除</a>
              </Popconfirm>
            </Space>
          );
        }}
        pagination={{
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: pageSize,
          total: movieList?.totalMovies,
          showTotal: (total, range) => `共 ${total} 条，${range[0]}-${range[1]} 条`,
          onChange: (page, pageSize) => getMovieList(page, pageSize),
        }}
      />
      {/* 新建弹窗 */}
      <ModalForm
        title="新建电影"
        width="400px"
        formRef={restFormRef}
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        submitter={{
          searchConfig: {
            resetText: '取消',
          },
          resetButtonProps: {
            onClick: () => {
              restFormRef.current?.resetFields();
              handleModalOpen(false);
            },
          },
        }}
        onFinish={async (value) => {
          const newMovie = {
            ...value,
            movieTypes: value.movieTypes.split(','),
            languages: value.languages.split(','),
            countries: value.countries.split(','),
            actors: value.actors.split(','),
            directors: value.directors.split(','),
            writers: value.writers.split(','),
            dateReleased: '未知',
            collectionVotes: 0,
          };
          const { success, msg } = await movieApi.addMovie(newMovie);
          if (success) {
            message.success(msg);
            restFormRef.current?.resetFields();
            handleModalOpen(false);
          }
          if (!success) {
            message.warning(msg);
          }
        }}
      >
        <ProFormText label="电影名称" width="md" name="name" rules={[{ required: true }]} />
        <ProFormText label="豆瓣Id" width="md" name="doubanId" rules={[{ required: true }]} />
        <ProFormText label="简介" width="md" name="description" rules={[{ required: true }]} />
        <ProFormDigit label="评分" width="md" name="rate" rules={[{ required: true }]} />
        <ProFormText label="电影预告" width="md" name="video" rules={[{ required: true }]} />
        <ProFormText label="电影海报" width="md" name="poster" rules={[{ required: true }]} />
        <ProFormText label="电影类型" width="md" name="movieTypes" rules={[{ required: true }]} />
        <ProFormDigit label="电影年份" width="md" name="year" rules={[{ required: true }]} />
        <ProFormText label="电影语言" width="md" name="languages" rules={[{ required: true }]} />
        <ProFormText label="电影地区" width="md" name="countries" rules={[{ required: true }]} />
        <ProFormText label="电影演员" width="md" name="actors" rules={[{ required: true }]} />
        <ProFormText label="电影导演" width="md" name="directors" rules={[{ required: true }]} />
        <ProFormText label="电影编剧" width="md" name="writers" rules={[{ required: true }]} />
      </ModalForm>

      {/* 详情弹窗 */}
      <Drawer
        width={400}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        <MovieDetail movieDetail={currentRow as unknown as Movie} />
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
