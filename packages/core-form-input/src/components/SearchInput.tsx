import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DirectionsIcon from '@material-ui/icons/Directions';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

export interface ISearchInputProps extends Omit<InputBaseProps, 'onChange' | 'value'>, ILazyInputProps {
  width?: number | string;
  value?: number | string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: ISearchInputProps) => ({
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: props.width || 400
    }),
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

function useShadowValueFactory<V = any>({ value }: { value: V }) {
  const [currentValue, setValue] = React.useState(value || '')
  const [shadowValue, setShadowValue] = React.useState(value || '')
  return {
    currentValue,
    shadowValue,
    setShadowValue,
    setValue
  }
}


export interface ILazyInputProps {
  useLazyHandler?: boolean;
  onChange?: (value: string | number) => void;
  onBlur?: InputBaseProps['onBlur']
}

export function useLazyValueListener<P extends ILazyInputProps, V = any>(
  initValue: V,
  props: P & { value?: V }
): {
  onBlur?: InputBaseProps['onBlur'],
  onChange: InputBaseProps['onChange'],
  value: any
} | {} {
  const { onChange, onBlur, value: propsValue, useLazyHandler } = props
  const store = useShadowValueFactory({ value: initValue })
  
  React.useEffect(() => {
    if (store.currentValue !== propsValue) {
      store.setShadowValue(propsValue as any)
      store.setValue(propsValue as any)
    }
  }, [propsValue, store.currentValue])

  // React.useImperativeHandle<Input>(ref, () => {
  //   return {
  //     onChange() {

  //     },
  //     onBlur() {

  //     }
  //   }
  // })
  const listeners = [onBlur, onChange, useLazyHandler, store.shadowValue, store.currentValue]
  if (!useLazyHandler) {
    return React.useMemo(() => ({
      get value() {
        return store.shadowValue || ''
      },
      onChange(e: any) {
        const nextValue = e.target.value
        store.setShadowValue(nextValue)
        if (e.target.value !== propsValue) {
          onChange && onChange(nextValue)
          warning(false, 'handle Change');
        }
        if (store.currentValue !== nextValue) {// 记录最后变更的值
          store.setValue(nextValue)
        }
      },
      onBlur
    }), listeners)
  } else {
    return React.useMemo(() => ({
      get value() {
        return store.shadowValue || ''
      },
      onChange(e: any) {
        store.setShadowValue(e.target.value)
        // console.log(store.shadowValue);
      },
      onBlur(e: any) {
        const nextValue: V = e && e.target && e.target.value || ''
        if (nextValue !== propsValue) {
          onChange && onChange(nextValue as any)
          warning(false, 'handle Change')
          warning(false, nameof(nextValue))
          if (store.currentValue !== nextValue) // 记录最后变更的值
            store.setValue(nextValue)
          // Input类焦点移除时不需要额外事件
          // Utils.isFunction(onBlur) && onBlur(e)
        }
        onBlur && onBlur(e)
      }
    }), listeners) as any
  }
}


export default function SearchInput(props: ISearchInputProps) {
  const { onChange, useLazyHandler, value = '', onBlur, ...otherProps } = props
  const classes = useStyles(props);
  // const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   props.onChange && e && e.target && props.onChange(e.target.value)
  //   console.log('handle Change')
  // }, [props.onChange])
  // const handleBlur = useCallback((e) => {
  //   props.onBlur && props.onBlur(e)
  //   console.log('handle Blur')
  // }, [props.onChange])
  const eventProps = useLazyValueListener(props.value, { onChange, useLazyHandler, value, onBlur })

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        {...otherProps}
        inputProps={{
          'aria-label': props.placeholder,
          ...props.inputProps
        }}
        {...eventProps}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
}
SearchInput.defaultProps = {
  placeholder: '请输入',
  inputProps: {}
}
SearchInput.propsKeys = tsKeys<ISearchInputProps>()
if (__DEV__) {
  const r = oc({ a: { b: { c: false } } }).a.b.c(true)
  invariant(r === false, 'oc faild')
}