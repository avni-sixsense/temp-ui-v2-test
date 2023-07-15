import classes from './Legends.module.scss';

type LegendData = {
  name: string;
  color: string;
};

type ChartLegendsProps = {
  title: string;
  data: LegendData[];
  totalHeader?: string;
};

export const ChartLegends = ({
  data,
  title,
  totalHeader
}: ChartLegendsProps) => {
  return (
    <div className={classes.root}>
      {totalHeader && <div className={classes.totalHeader}>{totalHeader}</div>}
      <div className={classes.title}>{title}</div>
      <div className={classes.legendsContainer}>
        {data.map(legend => (
          <div className={classes.legend}>
            <div
              className={classes.legendBox}
              style={{ backgroundColor: legend.color }}
            />
            <div className={classes.legendName}>{legend.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
