CREATE TABLE `Interface` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(100) DEFAULT NULL,
  `biz` varchar(20) DEFAULT NULL COMMENT '1:www 2:t 3:e',
  `param` varchar(1000) DEFAULT NULL COMMENT 'interface doc',
  `app` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf-8;

CREATE TABLE `TestCase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) DEFAULT NULL COMMENT 'interface id',
  `testcase` varchar(2000) DEFAULT NULL,
  `fakedata` text,
  `type` tinyint(2) DEFAULT NULL COMMENT '1 for fe,2 for be',
  `alpha_ok` tinyint(1) DEFAULT NULL,
  `beta_ok` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf-8;
